import React from "react";
import { BarType } from "../../../../charts/styleConfigs/bar";
import { LabelPosition, LegendPosition, LineStyleType, PieLabelPosition, RadarType, RotateType } from "../../../../charts/types";

export const sizeArr = [
    10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 128
];

export function isFormEventType(e: any): e is React.FormEvent {
    if (e.target) {
        return true;
    }
    return false;
}

export function isLegendPositon(e: any): e is LegendPosition {
    if (typeof e !== "string") return false;
    else {
        if (Object.values(LegendPosition).includes(e as LegendPosition)) return true;
    }
    return false;
}

export function isLineStyleType(e: any): e is LineStyleType {
    if (typeof e !== "string") return false;
    else {
        if (Object.values(LineStyleType).includes(e as LineStyleType)) return true;
    }
    return false;
}

export function isBarType(e: any): e is BarType {
    if (typeof e !== "string") return false;
    else {
        if (Object.values(BarType).includes(e as BarType)) return true;
    }
    return false;
}

export function isRotateType(e: any): e is RotateType {
    if (typeof e !== "string") return false;
    else {
        console.log(e, Object.values(RotateType))
        if (Object.values(RotateType).includes(e as RotateType)) return true;
    }
    return false;
}

export function isLabelPositon(e: any): e is LabelPosition {
    if (typeof e !== "string") return false;
    else {
        if (Object.values(LabelPosition).includes(e as LabelPosition)) return true;
    }
    return false;
}

export function isPieLabelPosition(e: any): e is PieLabelPosition {
    if (typeof e !== "string") return false;
    else {
        if (Object.values(PieLabelPosition).includes(e as PieLabelPosition)) return true;
    }
    return false;
}

export function isRadarType(e: any): e is RadarType {
    if (typeof e !== "string") return false;
    else {
        console.log(e, Object.values(RadarType))
        if (Object.values(RadarType).includes(e as RadarType)) return true;
    }
    return false;
}
