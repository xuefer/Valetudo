import MapStructure from "./MapStructure";
import bathroomScaleIconSVG from "../icons/obstacles/bathroom-scale.svg";
import cableIconSVG from "../icons/obstacles/cable.svg";
import defaultIconSVG from "../icons/obstacles/default.svg";
import fabricIconSVG from "../icons/obstacles/fabric.svg";
import furnitureIconSVG from "../icons/obstacles/furniture.svg";
import obstacleIconSVG from "../icons/obstacles/obstacle.svg";
import powerStripIconSVG from "../icons/obstacles/power-strip.svg";
import shoeIconSVG from "../icons/obstacles/shoe.svg";
import {Canvas2DContextTrackingWrapper} from "../../utils/Canvas2DContextTrackingWrapper";
import {considerHiDPI} from "../../utils/helpers";

function newImg(src: string) : HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
}

type ObstacleIcons = {
    [key: string]: HTMLImageElement
}

const defaultImg = newImg(defaultIconSVG);
const obstacleIcons: ObstacleIcons = {
    "bathroom scale": newImg(bathroomScaleIconSVG),
    cable: newImg(cableIconSVG),
    fabric: newImg(fabricIconSVG),
    furniture: newImg(furnitureIconSVG),
    obstacle: newImg(obstacleIconSVG),
    "power strip": newImg(powerStripIconSVG),
    shoe: newImg(shoeIconSVG),
};

class ObstacleMapStructure extends MapStructure {
    public static TYPE = "ObstacleMapStructure";
    private label: string | undefined;

    constructor(x0: number, y0: number, label?: string) {
        super(x0, y0);

        this.label = label;
    }

    draw(ctxWrapper: Canvas2DContextTrackingWrapper, transformationMatrixToScreenSpace: DOMMatrixInit, scaleFactor: number): void {
        const ctx = ctxWrapper.getContext();
        const p0 = new DOMPoint(this.x0, this.y0).matrixTransform(transformationMatrixToScreenSpace);


        const name = (/^(.*) \(/.exec(this.label ?? "") ?? [])[1] ?? "";
        const img = obstacleIcons[name.toLowerCase()] ?? defaultImg;
        const scaledSize = {
            width: Math.max(considerHiDPI(img.width) / (considerHiDPI(8) / scaleFactor), considerHiDPI(img.width) * 0.3),
            height: Math.max(considerHiDPI(img.height) / (considerHiDPI(8) / scaleFactor), considerHiDPI(img.height) * 0.3)
        };

        ctx.drawImage(
            img,
            p0.x - scaledSize.width / 2,
            p0.y - scaledSize.height / 2,
            scaledSize.width,
            scaledSize.height
        );

        if (this.label && scaleFactor >= considerHiDPI(28)) {
            ctxWrapper.save();

            ctx.textAlign = "center";
            ctx.font = `${considerHiDPI(32)}px sans-serif`;
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.strokeStyle = "rgba(18, 18, 18, 1)";

            ctx.lineWidth = considerHiDPI(2.5);
            ctx.strokeText(this.label, p0.x , p0.y + (scaledSize.height/2) + considerHiDPI(32));

            ctx.lineWidth = considerHiDPI(1);
            ctx.fillText(this.label, p0.x , p0.y + (scaledSize.height/2) + considerHiDPI(32));

            ctxWrapper.restore();
        }
    }

    getType(): string {
        return ObstacleMapStructure.TYPE;
    }
}

export default ObstacleMapStructure;
