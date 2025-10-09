package controller

import (
	"github.com/kamva/mgm/v3"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"github.com/MishraShardendu22/util"
	"github.com/MishraShardendu22/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetVolunteerExperiences(c *fiber.Ctx) error {
	var exps []models.VolunteerExperience
	if err := mgm.Coll(&models.VolunteerExperience{}).SimpleFind(&exps, bson.M{}); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to fetch volunteer experiences", nil, "")
	}

	if len(exps) == 0 {
		return util.ResponseAPI(c, fiber.StatusOK, "No volunteer experiences found", nil, "")
	}

	exps = ReverseVolunteerExperiences(exps)
	return util.ResponseAPI(c, fiber.StatusOK, "Volunteer experiences retrieved successfully", exps, "")
}

func GetVolunteerExperienceByID(c *fiber.Ctx) error {
	eid := c.Params("id")
	if eid == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Volunteer experience ID is required", nil, "")
	}

	expObjID, err := primitive.ObjectIDFromHex(eid)
	if err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid volunteer experience ID", nil, "")
	}

	var e models.VolunteerExperience
	if err := mgm.Coll(&models.VolunteerExperience{}).FindByID(expObjID, &e); err != nil {
		return util.ResponseAPI(c, fiber.StatusNotFound, "Volunteer experience not found", nil, "")
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Volunteer experience retrieved successfully", e, "")
}

func AddVolunteerExperiences(c *fiber.Ctx) error {
	var e models.VolunteerExperience
	if err := c.BodyParser(&e); err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid request body", nil, "")
	}

	if e.Organisation == "" || len(e.VolunteerTimeLine) == 0 {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Organisation and at least one timeline entry are required", nil, "")
	}

	if err := mgm.Coll(&models.VolunteerExperience{}).Create(&e); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to add volunteer experience", nil, "")
	}

	var user models.User
	if err := mgm.Coll(&models.User{}).First(bson.M{}, &user); err != nil {
		return util.ResponseAPI(c, fiber.StatusNotFound, "User not found", nil, "")
	}

	user.Experiences = append(user.Experiences, e.ID)
	if err := mgm.Coll(&models.User{}).Update(&user); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to update user volunteer experiences", nil, "")
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Volunteer experience added successfully", e, "")
}

func UpdateVolunteerExperiences(c *fiber.Ctx) error {
	eid := c.Params("id")
	if eid == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Volunteer experience ID is required", nil, "")
	}

	expObjID, err := primitive.ObjectIDFromHex(eid)
	if err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid volunteer experience ID", nil, "")
	}

	var input models.VolunteerExperience
	if err := c.BodyParser(&input); err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid request body", nil, "")
	}

	if input.Organisation == "" || len(input.VolunteerTimeLine) == 0 {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Organisation and at least one timeline entry are required", nil, "")
	}

	var existing models.VolunteerExperience
	if err := mgm.Coll(&models.VolunteerExperience{}).FindByID(expObjID, &existing); err != nil {
		return util.ResponseAPI(c, fiber.StatusNotFound, "Volunteer experience not found", nil, "")
	}

	// Append new timeline entries instead of overwriting
	existing.VolunteerTimeLine = append(existing.VolunteerTimeLine, input.VolunteerTimeLine...)

	// Update other fields
	existing.Organisation = input.Organisation
	existing.Description = input.Description
	existing.Technologies = input.Technologies
	existing.Projects = input.Projects
	existing.OrganisationLogo = input.OrganisationLogo
	existing.Images = input.Images

	if err := mgm.Coll(&models.VolunteerExperience{}).Update(&existing); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to update volunteer experience", nil, "")
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Volunteer experience updated successfully", existing, "")
}

func RemoveVolunteerExperiences(c *fiber.Ctx) error {
	var user models.User
	if err := mgm.Coll(&models.User{}).First(bson.M{}, &user); err != nil {
		return util.ResponseAPI(c, fiber.StatusNotFound, "User not found", nil, "")
	}

	eid := c.Params("id")
	if eid == "" {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Volunteer experience ID is required", nil, "")
	}

	var updated []primitive.ObjectID
	found := false
	for _, expID := range user.Experiences {
		if expID.Hex() == eid {
			found = true
			continue
		}
		updated = append(updated, expID)
	}

	if !found {
		return util.ResponseAPI(c, fiber.StatusNotFound, "Volunteer experience not found", nil, "")
	}

	user.Experiences = updated
	if err := mgm.Coll(&models.User{}).Update(&user); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to remove volunteer experience", nil, "")
	}

	expObjID, err := primitive.ObjectIDFromHex(eid)
	if err != nil {
		return util.ResponseAPI(c, fiber.StatusBadRequest, "Invalid volunteer experience ID", nil, "")
	}

	proj := &models.VolunteerExperience{}
	proj.SetID(expObjID)
	if err := mgm.Coll(proj).Delete(proj); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to delete volunteer experience", nil, "")
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Volunteer experience removed successfully", nil, "")
}
