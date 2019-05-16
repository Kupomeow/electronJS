APPLICATION MY COMPTA

- First step, must be sure you have node.js installed of your computer.
- Install dependency with : "npm install" in the folder of application.
- Run application with : "npm start"

This application is packaged with electron-packaged.
You can find 2 packages (One for windows, Second for Mac). Run executable files for launch the App.

EXPLAINATION

For package the application, I've used a dependency "electron-packager". You can install it with npm.
I've add " "productName": "Electron tutorial app" " into package.json.

After that, I've create two package. One for Windows, second for MacOS.
    
    - For Windows : 
        electron-packager . electron-tutorial-app --overwrite --asar=true --platform=win32 --arch=ia32 --prune=true --out=release-builds --version-string.CompanyName=CE -version-string.FileDescription=CE --version-string.ProductName="Electron Tutorial App"

    - For Mac :  
        electron-packager . --overwrite --platform=darwin --arch=x64  --prune=true --out=release-builds

These command lines creates a new folder "release-builds" with two packages app.