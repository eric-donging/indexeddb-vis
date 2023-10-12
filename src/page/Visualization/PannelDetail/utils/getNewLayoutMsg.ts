import { Layouts } from "../components/PannelContent";
import { v4 as uuidv4 } from 'uuid';

type NewLayoutsMsg = {
    newLayouts: Layouts
    id: string
}

const getNewLayoutMsg = (layouts: Layouts): NewLayoutsMsg => {
    const lgLayouts = layouts.sm;
    const length = lgLayouts.length;
    const x = length % 2 === 0 ? 0 : 6;
    const y = Math.floor(length / 2) * 6;
    const i = uuidv4();
    const res: Layouts = {
        sm: [...layouts.sm, { i, x, y, w: 6, h: 6 }],
        xs: [...layouts.xs, { i, x, y, w: 2, h: 6 }],
    }
    return {
        newLayouts: res,
        id: i
    };
};

export default getNewLayoutMsg;
