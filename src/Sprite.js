import { Vector2 } from "./Vector2";

export class Sprite {
    constructor({
        resource, //Image to draw
        frameSize, //Size of the crop of the image (ex:- 64x64)
        hFrames,
        vFrames,
        Frame, //Frame to display
        scale, //Size in which to draw the image
        position //Where to draw it
    }) {
        this.resource = resource;
        this.frameSize = frameSize ?? new Vector2(16,16);
        this.hFrames = hFrames ?? 1;
        this.vFrames = vFrames ?? 1;
        this.Frame = Frame ?? 0;
        this.frameMap = new Map();
        this.scale = scale ?? 1;
        this.position = position ?? new Vector2(0,0);
        this.buildFrameMap();
    }

    buildFrameMap(){
        let frameCount = 0;
        for( let v=0;v<this.vFrames; v++){
            for(let h=0;h<this.hFrames;h++){
                this.frameMap.set(
                    frameCount,
                    new Vector2(this.frameSize.x * h, this.frameSize.y * v)
                )
                frameCount++;
            }
        }
    }

    drawImage(ctx,x,y){
        if(!this.resource.is_loaded){
            return;
        }

        let frameCoordX = 0;
        let frameCoordY = 0;

        const frame = this.frameMap.get(this.Frame);
        if(frame){
            frameCoordX = frame.x;
            frameCoordY = frame.y;
        }

        const frameSizeX = this.frameSize.x;
        const frameSizeY = this.frameSize.y;

        ctx.drawImage(
            this.resource.image,
            frameCoordX,
            frameCoordY,
            frameSizeX,
            frameSizeY,
            x,
            y,
            frameSizeX * this.scale,
            frameSizeY * this.scale,
        );
    }
}