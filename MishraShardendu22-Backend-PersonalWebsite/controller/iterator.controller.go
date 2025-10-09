package controller

import "github.com/MishraShardendu22/models"

func ReverseExperiences(exps []models.Experience) []models.Experience {
	for i, j := 0, len(exps)-1; i < j; i, j = i+1, j-1 {
		exps[i], exps[j] = exps[j], exps[i]
	}
	return exps
}

func ReverseVolunteerExperiences(exps []models.VolunteerExperience) []models.VolunteerExperience {
	for i, j := 0, len(exps)-1; i < j; i, j = i+1, j-1 {
		exps[i], exps[j] = exps[j], exps[i]
	}
	return exps
}
