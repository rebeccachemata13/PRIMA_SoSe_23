# Tiles Jumper

## Author
Rebecca Chemata

## Matrikelnummer
266637

## Year and Season
Sommersemester 2023

## Course
PRIMA -> Prototyping Inkeraktiver Medien & Apps

## Curriculum and Semester
OMB 6

## Docent
Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU

## Finished Application Link
[Tiles Jumper](https://rebeccachemata13.github.io/PRIMA_SoSe_23/Bouncy_Ball_Tile_Jumper/index.html)

## Repository Link
[Repository](https://github.com/rebeccachemata13/PRIMA_SoSe_23/tree/main/Bouncy_Ball_Tile_Jumper)

## Documentation Link
[Documentation](https://rebeccachemata13.github.io/PRIMA_SoSe_23/Bouncy_Ball_Tile_Jumper/Tiles%20Hoops-Bouncy%20Ball_Dokumentation.pdf)


## How to interact:
After clicking "START," you need to move the ball either to the left or to the right in order to hit the tiles along your path. 
Control the ball via Mouse Movement. 

## Criteria fullfillments
For more information to the fullfillments check out the documentation!

| Nr | Criterion           | Fullfillment                                                                                                                                    |
|---:|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
|  1 | Units and Positions | 0 is the initial position of the ball at the start of the game and 1 is the next tile along the x-axis or z-axis.                               |
|  2 | Hierarchy           | Graph Level has two nodes: Avatar and an ExampleTile. The ExampleTile wasn't necessary, but helped scaling the other tiles.                     |
|  3 | Editor              | The Avatar and the setup (Camera, Light etc.) where done via Editor, the rest is generated as the game starts.                                  |
|  4 | Scriptcomponents    | A ScriptComponent was used to make the ball keep bouncing and change its color, but it wasn't necessary.                                        |
|  5 | Extend              | Used a Tiles Class, in order to make different instances and to adjust position, pitch, jumpforce of the ball etc. for each tile.               |
|  6 | Sound               | Used the Web Audio API to create sinus waves with different frequencies for each tile. Depending on the tile it plays a different sinus wave.   |
|  7 | VUI                 | The user is able to keep track of their score, the note they are currently playing and its frequency.                                           |
|  8 | Event-System        | Used Custom Event to call the function avatarCollided() each time the avatar collides with a tile.                                              |
|  9 | External Data       | Created a config file with an array of all tiles. That way I can adjust the postion, the pitch, the frequency and the jumpforce for each tile.  |
|  A | Light               | Included directional light, to light up my tiles from the top and ambient light.                                                                |
|  B | Physics             | Added rigidbody components, worked with collisions (1) for the tile collision and used forces (1) for the ball movement and jumpforce.          |
|  E | Animation           | Used the animation system of FudgeCore to make a bouncing ball animation, that plays each time the ball collides with a tile.                   |




