package route

import (
	"github.com/MishraShardendu22/controller"
	"github.com/gofiber/fiber/v2"
)

func SetupTimeline(app *fiber.App, secret string) {

	app.Get("/api/timeline", controller.ExperienceTimeline)
}
