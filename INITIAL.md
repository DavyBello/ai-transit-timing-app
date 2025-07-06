## FEATURE:

- Next.js App that shows the optimal time for a user to leave their house and minimise downtime waiting for public transport (Trains/ Metro / Bus)
- The app should show the user in a visual manner (using a circular guage with a green, orange and red section)
- green means it's a good time to leave
- orange means the user might still be able to catch the train/bus but it will be a tight connection
- red means the user will have to wait longer than the maximum wait time specified by the user

## User Inputs:
- Origin: A location the user is leaving from
- Destination: Where the user wants to go
- Maximum Wait time: How long the user wants to spend waiting for a the metro/ train/bus

## App Output:
- A Guage with a pointer needle with 3 sections
- Green, orange and Red as described above
- A collapsable map view that shows the route and the station the user needs to get to as well as the destination

## DOCUMENTATION:
Next.JS App framework documentation: https://nextjs.org/docs
Google Maps API routes documentation: https://developers.google.com/maps/documentation/routes
Transit mode documentation: https://developers.google.com/maps/documentation/routes/transit-route

## OTHER CONSIDERATIONS:

- Include a .env.example, README with instructions for setup including how to configure Google maps API.
- Include the project structure in the README.
