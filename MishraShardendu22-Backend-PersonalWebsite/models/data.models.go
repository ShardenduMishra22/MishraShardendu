// models/models.go
package models

import (
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	mgm.DefaultModel `bson:",inline" json:"inline"`
	Email            string               `bson:"email" json:"email"`
	Skills           []string             `bson:"skills" json:"skills"`
	Password         string               `bson:"password" json:"password"`
	Projects         []primitive.ObjectID `bson:"projects" json:"projects"`
	AdminPass        string               `bson:"admin_pass" json:"admin_pass"`
	Experiences      []primitive.ObjectID `bson:"experiences" json:"experiences"`
	Certifications   []primitive.ObjectID `bson:"certifications" json:"certifications"`
}

type Project struct {
	mgm.DefaultModel  `bson:",inline" json:"inline"`
	Order             int      `bson:"order" json:"order"`
	Skills            []string `bson:"skills" json:"skills"`
	Description       string   `bson:"description" json:"description"`
	ProjectName       string   `bson:"project_name" json:"project_name"`
	ProjectVideo      string   `bson:"project_video" json:"project_video"`
	ProjectLiveLink   string   `bson:"project_live_link" json:"project_live_link"`
	SmallDescription  string   `bson:"small_description" json:"small_description"`
	ProjectRepository string   `bson:"project_repository" json:"project_repository"`
}

type Experience struct {
	mgm.DefaultModel   `bson:",inline" json:"inline"`
	Images             []string             `bson:"images" json:"images"`
	Projects           []primitive.ObjectID `bson:"projects" json:"projects"`
	CreatedBy          string               `bson:"created_by" json:"created_by"`
	Description        string               `bson:"description" json:"description"`
	Technologies       []string             `bson:"technologies" json:"technologies"`
	CompanyName        string               `bson:"company_name" json:"company_name"`
	CompanyLogo        string               `bson:"company_logo" json:"company_logo"`
	CertificateURL     string               `bson:"certificate_url" json:"certificate_url"`
	ExperienceTimeline []ExperienceTimeLine `bson:"experience_time_line" json:"experience_time_line"`
}

type CertificationOrAchievements struct {
	mgm.DefaultModel `bson:",inline" json:"inline"`
	Title            string               `bson:"title" json:"title"`
	Skills           []string             `bson:"skills" json:"skills"`
	Images           []string             `bson:"images" json:"images"`
	Issuer           string               `bson:"issuer" json:"issuer"`
	Projects         []primitive.ObjectID `bson:"projects" json:"projects"`
	IssueDate        string               `bson:"issue_date" json:"issue_date"`
	ExpiryDate       string               `bson:"expiry_date" json:"expiry_date"`
	Description      string               `bson:"description" json:"description"`
	CertificateURL   string               `bson:"certificate_url" json:"certificate_url"`
}

type VolunteerExperience struct {
	mgm.DefaultModel  `bson:",inline" json:"inline"`
	Images            []string                      `bson:"images" json:"images"`
	Projects          []primitive.ObjectID          `bson:"projects" json:"projects"`
	CreatedBy         string                        `bson:"created_by" json:"created_by"`
	Description       string                        `bson:"description" json:"description"`
	Technologies      []string                      `bson:"technologies" json:"technologies"`
	Organisation      string                        `bson:"organisation" json:"organisation"`
	OrganisationLogo  string                        `bson:"organisation_logo" json:"organisation_logo"`
	VolunteerTimeLine []VolunteerExperienceTimeLine `bson:"volunteer_time_line" json:"volunteer_time_line"`
}

type ExperienceTimeLine struct {
	Position  string `bson:"position" json:"position"`
	EndDate   string `bson:"end_date" json:"end_date"`
	StartDate string `bson:"start_date" json:"start_date"`
}

type VolunteerExperienceTimeLine struct {
	PositionOfAuthority string `bson:"position" json:"position"`
	EndDate             string `bson:"end_date" json:"end_date"`
	StartDate           string `bson:"start_date" json:"start_date"`
}


type UpdatedProject struct {
	Order     int                `bson:"order" json:"order"`
	ProjectID primitive.ObjectID `bson:"project_id" json:"project_id"`
}

type ProjectKanban struct {
	Order     int                `bson:"order" json:"order"`
	ProjectID primitive.ObjectID `bson:"project_id" json:"project_id"`
	ProjectTitle string          `bson:"project_title" json:"project_title"`
}