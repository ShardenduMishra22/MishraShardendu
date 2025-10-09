package route

import (
	"github.com/MishraShardendu22/controller"
	"github.com/MishraShardendu22/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupProjectRoutes(app *fiber.App, secret string) {
	// Public routes - no authentication required
	app.Get("/api/projects", controller.GetProjects)
	app.Get("/api/projects/kanban", controller.GetProjectsKanban)
	// app.Get("/api/UpdateProjectOrderInitial",controller.UpdateProjectOrder)
	
	// Admin routes - authentication required
	app.Post("/api/projects", middleware.JWTMiddleware(secret), controller.AddProjects)
	app.Post("/api/projects/updateOrder", middleware.JWTMiddleware(secret), controller.UpdateProjectOrderKanban)

	app.Get("/api/projects/:id", controller.GetProjectByID)
	app.Put("/api/projects/:id", middleware.JWTMiddleware(secret), controller.UpdateProjects)
	app.Delete("/api/projects/:id", middleware.JWTMiddleware(secret), controller.RemoveProjects)
}

/*
Route order is important in Fiber routing:
- Specific routes like "/api/projects/kanban" must be defined BEFORE parameterized routes like "/api/projects/:id"
- If "/api/projects/:id" comes first, the router would treat "kanban" as a value for the :id parameter
- Current implementation is correct: /kanban route is defined before /:id route
*/
