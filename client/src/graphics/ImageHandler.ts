export const imageNames = [
  'CardTemplate.png',
  'KingKJuul.png', 
];

export class ImageHandler{
    public static images: Map<string,HTMLImageElement> = new Map();
    public static loaded:boolean = false;

    static loadImages(){
        // const imageKeys = Object.keys(Images.images);

        let directory_name = "/images/";
        imageNames.forEach((file:string) => {
            const keyName =file.substring(0,file.indexOf(".")) 
            const img = new Image();
            img.src = directory_name+file;
            ImageHandler.images.set(keyName,img);

        });

        console.log("loaded images!");
        ImageHandler.loaded = true;
    }

}