# Draw With Friends!

### What is it?
--------
Draw With Friends is an app built with ExpressJS+Socket.io to allow users to join a 'room' with multiple friends and draw!


### Some of the current features include...
--------
- Different color selection
- Switch from drawing rough lines to smooth lines with the 'g' key
- The current canvas will be sent to a new player and deleted when everyone leaves a room
- Clicking the save button will download the current image to your computer as a .png

### How to install...
---------
- Clone the repo
- `npm install` to install the Node dependencies
- `npm start` to start your server
- The app will be running at http://localhost:3000 by default

### Known bugs....
---------
- When another player disconnects, their name will remain on the screen until the user rejoins. This is only a problem when someone closes the window with `ctrl+w`
