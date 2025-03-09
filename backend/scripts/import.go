package scripts

import (
	"encoding/csv"
	"fmt"
	"go-orm-template/auth"
	"go-orm-template/db"
	"go-orm-template/models"
	"os"
	"strconv"
)

func ImportPlayersFromCSV() {
	// Drop and recreate the table
	fmt.Println("Dropping and recreating the Player table")
	db.ORM.Migrator().DropTable(&models.Player{})
	db.ORM.AutoMigrate(&models.Player{})

	file, err := os.Open("data/players.csv")
	if err != nil {
		fmt.Printf("Error opening file: %v\n", err)
		return
	}
	defer file.Close()

	// Create a CSV reader
	reader := csv.NewReader(file)

	// Skip header row
	_, err = reader.Read()
	if err != nil {
		fmt.Printf("Error reading header: %v\n", err)
		return
	}

	// Read and process each row
	// Skip first record
	_, err = reader.Read()
	if err != nil {
		fmt.Printf("Error skipping first record: %v\n", err)
		return
	}

	for {
		record, err := reader.Read()
		if err != nil {
			break // Break at EOF
		}

		// Convert string values to appropriate types
		totalRuns, _ := strconv.Atoi(record[3])
		ballsFaced, _ := strconv.Atoi(record[4])
		inningsPlayed, _ := strconv.Atoi(record[5])
		wickets, _ := strconv.Atoi(record[6])
		oversBowled, _ := strconv.ParseFloat(record[7], 64)
		runsConceded, _ := strconv.Atoi(record[8])

		// Create player object
		player := &models.Player{
			Name:          record[0],
			University:    record[1],
			Category:      record[2],
			TotalRuns:     totalRuns,
			BallsFaced:    ballsFaced,
			InningsPlayed: inningsPlayed,
			Wickets:       wickets,
			OversBowled:   oversBowled,
			RunsConceded:  runsConceded,
		}

		fmt.Printf("Adding Player: %s\n", player.Name)
		// Save to database

		err = models.AddPlayer(player)

		if err != nil {
			fmt.Printf("Error creating player %s: %v\n", player.Name, err)
			continue
		}

		fmt.Printf("Successfully imported player: %s\n", player.Name)
	}

	fmt.Println("Import completed")
}

func ImportDefaultUsers() {
	// Drop and recreate the table
	fmt.Println("Dropping and recreating the User table")
	db.ORM.Migrator().DropTable(&models.User{})
	db.ORM.AutoMigrate(&models.User{})

	users := []*models.User{
		{
			Username: "spiritx_2025",
			Password: "SpiritX@2025",
			Name:     "SpiritX",
			Role:     "admin",
			Approved: true,
			Budget:   9000000,
		},
		{
			Username: "admin",
			Password: "Pass@123",
			Name:     "Admin",
			Role:     "admin",
			Approved: true,
			Budget:   9000000,
		},
		{
			Username: "maathavan",
			Password: "Pass@123",
			Name:     "Maathavan",
			Role:     "admin",
			Approved: true,
			Budget:   9000000,
		},
	}

	for _, user := range users {
		fmt.Printf("Adding User: %s\n", user.Username)

		// hash password
		hashedPassword, err := auth.HashPassword(user.Password)
		if err != nil {
			fmt.Printf("Error hashing password for user %s: %v\n", user.Username, err)
			continue
		}

		user.Password = hashedPassword

		err = models.AddUser(user)
		if err != nil {
			fmt.Printf("Error creating user %s: %v\n", user.Username, err)
			continue
		}
		fmt.Printf("Successfully imported user: %s\n", user.Username)
	}
}
