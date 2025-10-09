package controller

import (
	"context"
	"sort"

	"github.com/MishraShardendu22/models"
	"github.com/MishraShardendu22/util"
	"github.com/gofiber/fiber/v2"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetProjects(c *fiber.Ctx) error {
	var projects []models.Project
	if err := mgm.Coll(&models.Project{}).SimpleFind(&projects, bson.M{}); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to fetch projects", nil, "")
	}

	if len(projects) == 0 {
		return util.ResponseAPI(c, fiber.StatusOK, "No projects found", nil, "")
	}

	sort.Slice(projects, func(i, j int) bool {
		return projects[i].Order < projects[j].Order
	})

	return util.ResponseAPI(c, fiber.StatusOK, "Projects retrieved successfully", projects, "")
}

func GetProjectByID(c *fiber.Ctx) error {
	pid := c.Params("id")
	if pid == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Project ID is required", nil, "")
	}
	projObjID, err := primitive.ObjectIDFromHex(pid)
	if err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid project ID", nil, "")
	}
	var p models.Project
	if err := mgm.Coll(&models.Project{}).FindByID(projObjID, &p); err != nil {
		return util.ResponseAPI(c, fiber.StatusNotFound, "Project not found", nil, "")
	}
	return util.ResponseAPI(c, fiber.StatusOK, "Project retrieved successfully", p, "")
}

func AddProjects(c *fiber.Ctx) error {
	var p models.Project
	if err := c.BodyParser(&p); err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid request body", nil, "")
	}
	if p.ProjectName == "" || p.SmallDescription == "" || p.Description == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Name, small description and description are required", nil, "")
	}
	if err := mgm.Coll(&models.Project{}).Create(&p); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to add project", nil, "")
	}

	// Since there's only one user, get the first user from the database
	var user models.User
	if err := mgm.Coll(&models.User{}).First(bson.M{}, &user); err != nil {
		return util.ResponseAPI(c, fiber.StatusNotFound, "User not found", nil, "")
	}
	user.Projects = append(user.Projects, p.ID)
	if err := mgm.Coll(&models.User{}).Update(&user); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to update user projects", nil, "")
	}
	return util.ResponseAPI(c, fiber.StatusOK, "Project added successfully", p, "")
}

func UpdateProjects(c *fiber.Ctx) error {
	pid := c.Params("id")
	if pid == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Project ID is required", nil, "")
	}
	projObjID, err := primitive.ObjectIDFromHex(pid)
	if err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid project ID", nil, "")
	}

	var input models.Project
	if err := c.BodyParser(&input); err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid request body", nil, "")
	}
	if input.ProjectName == "" || input.SmallDescription == "" || input.Description == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Name, small description and description are required", nil, "")
	}

	update := bson.M{"$set": bson.M{
		"project_name":       input.ProjectName,
		"small_description":  input.SmallDescription,
		"description":        input.Description,
		"skills":             input.Skills,
		"project_repository": input.ProjectRepository,
		"project_live_link":  input.ProjectLiveLink,
		"project_video":      input.ProjectVideo,
	}}
	if _, err := mgm.Coll(&models.Project{}).UpdateByID(c.Context(), projObjID, update); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to update project", nil, "")
	}
	return util.ResponseAPI(c, fiber.StatusOK, "Project updated successfully", input, "")
}

func RemoveProjects(c *fiber.Ctx) error {
	var user models.User
	if err := mgm.Coll(&models.User{}).First(bson.M{}, &user); err != nil {
		return util.ResponseAPI(c, fiber.StatusNotFound, "User not found", nil, "")
	}

	pid := c.Params("id")
	if pid == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Project ID is required", nil, "")
	}

	// Convert pid to ObjectID
	objID, err := primitive.ObjectIDFromHex(pid)
	if err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid project ID", nil, "")
	}

	// Remove reference from user.Projects
	updated := make([]primitive.ObjectID, 0, len(user.Projects))
	for _, projID := range user.Projects {
		if projID != objID {
			updated = append(updated, projID)
		}
	}
	user.Projects = updated

	// Update user
	if err := mgm.Coll(&models.User{}).Update(&user); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to update user", nil, "")
	}

	// Delete actual project
	proj := &models.Project{}
	proj.SetID(objID)
	if err := mgm.Coll(proj).Delete(proj); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to delete project", nil, "")
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Project removed successfully", nil, "")
}

// func UpdateProjectOrderInitial(c *fiber.Ctx) error {
// 	var projects []models.Project

// 	if err := mgm.Coll(&models.Project{}).SimpleFind(&projects, bson.M{}); err != nil {
// 		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to fetch projects", nil, "")
// 	}

// 	i := 1
// 	for _, project := range projects {
// 		project.Order = i
// 		if err := mgm.Coll(&project).Update(&project); err != nil {
// 			return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to update project order", nil, "")
// 		}
// 		i++
// 	}

// 	return util.ResponseAPI(c, fiber.StatusOK, "Project order updated", nil, "")
// }

func UpdateProjectOrderKanban(c *fiber.Ctx) error {
	var updatedProjects []models.UpdatedProject

	if err := c.BodyParser(&updatedProjects); err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid request body", nil, "")
	}

	for _, up := range updatedProjects {
		update := bson.M{"$set": bson.M{"order": up.Order}}

		_, err := mgm.Coll(&models.Project{}).UpdateOne(
			context.Background(),
			bson.M{"_id": up.ProjectID},
			update,
		)

		if err != nil {
			return err
		}
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Project order updated successfully", nil, "")
}

func GetProjectsKanban(c *fiber.Ctx) error {
	var projects []models.Project
	if err := mgm.Coll(&models.Project{}).SimpleFind(&projects, bson.M{}); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to fetch projects", nil, "")
	}

	if len(projects) == 0 {
		return util.ResponseAPI(c, fiber.StatusOK, "No projects found", nil, "")
	}

	sort.Slice(projects, func(i, j int) bool {
		return projects[i].Order < projects[j].Order
	})

	var mainProject []models.ProjectKanban
	for i := len(projects) - 1; i >= 0; i-- {
		mainProject = append(mainProject, models.ProjectKanban{
			Order:        projects[i].Order,
			ProjectID:    projects[i].ID,
			ProjectTitle: projects[i].ProjectName,
		})
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Projects retrieved successfully", mainProject, "")
}
