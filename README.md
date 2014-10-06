KinectStream
============

Stream Kinect Data over WebSockets
Work in Progress - NOT FOR PRODUCTION USE

Prerequisites:
* NodeJS
* Kinect For Windows SDK Public Preview
* Windows 8.1
 
KinectStreamNode is the WebSocket server. Open a command prompt in its directory and then run:
```
npm install
```
Once installed, you can run:
```
node index
```
To run the server.

BodyStream is a slightly-modified version of Body Basics with a WebSocket client streaming Body updates. Build and run it, and it will connect to the KinectStreamNode server and send the updates! You can open a browser to localhost:8000 to see the results.

Still have lots to do, but this enables JS clients to get all the data from a Kinect BodyFrame.
