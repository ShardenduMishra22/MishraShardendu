package route

import (
	"github.com/MishraShardendu22/controller"
	"github.com/MishraShardendu22/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupVolunteerExpRoutes(app *fiber.App, secret string) {
	// Public routes - no authentication required
	app.Get("/api/volunteer/experiences", controller.GetVolunteerExperiences)
	app.Get("/api/volunteer/experiences/:id", controller.GetVolunteerExperienceByID)

	// Admin routes - authentication required
	app.Post("/api/volunteer/experiences", middleware.JWTMiddleware(secret), controller.AddVolunteerExperiences)
	app.Put("/api/volunteer/experiences/:id", middleware.JWTMiddleware(secret), controller.UpdateVolunteerExperiences)
	app.Delete("/api/volunteer/experiences/:id", middleware.JWTMiddleware(secret), controller.RemoveVolunteerExperiences)
}
