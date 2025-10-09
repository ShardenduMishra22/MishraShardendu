package controller

import (
	"github.com/MishraShardendu22/models"
	"github.com/MishraShardendu22/util"
	"github.com/gofiber/fiber/v2"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func ExperienceTimeline(c *fiber.Ctx) error {
	var exps []models.Experience
	var vexps []models.VolunteerExperience

	if err := mgm.Coll(&models.Experience{}).SimpleFind(&exps, bson.M{}); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to fetch experiences", nil, "")
	}

	if len(exps) == 0 {
		return util.ResponseAPI(c, fiber.StatusOK, "No experiences found", nil, "")
	}

	if err := mgm.Coll(&models.VolunteerExperience{}).SimpleFind(&vexps, bson.M{}); err != nil {
		return util.ResponseAPI(c, fiber.StatusInternalServerError, "Failed to fetch volunteer experiences", nil, "")
	}

	if len(vexps) == 0 {
		return util.ResponseAPI(c, fiber.StatusOK, "No volunteer experiences found", nil, "")
	}

	exps = ReverseExperiences(exps)
	vexps = ReverseVolunteerExperiences(vexps)

	var expTimeline []map[string]interface{}
	var vexpTimeline []map[string]interface{}

	for _, exp := range exps {
		for _, timeline := range exp.ExperienceTimeline {
			timelineWithOrg := map[string]interface{}{
				"position":     timeline.Position,
				"start_date":   timeline.StartDate,
				"end_date":     timeline.EndDate,
				"company_name": exp.CompanyName,
				"company_logo": exp.CompanyLogo,
			}
			expTimeline = append(expTimeline, timelineWithOrg)
		}
	}

	for _, vexp := range vexps {
		for _, timeline := range vexp.VolunteerTimeLine {
			timelineWithOrg := map[string]interface{}{
				"position":          timeline.PositionOfAuthority,
				"start_date":        timeline.StartDate,
				"end_date":          timeline.EndDate,
				"organisation":      vexp.Organisation,
				"organisation_logo": vexp.OrganisationLogo,
			}
			vexpTimeline = append(vexpTimeline, timelineWithOrg)
		}
	}

	response := map[string]interface{}{
		"experience_timeline":           expTimeline,
		"volunteer_experience_timeline": vexpTimeline,
	}

	return util.ResponseAPI(c, fiber.StatusOK, "Timeline fetched successfully", response, "")
}
