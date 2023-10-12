import React, { useCallback } from "react";
import cn from "classnames";
import styles from "./index.module.css";
import { ClassAndStyle, PannelTheme } from "../../../../../types";
import { CardStyleConfigObj, CardTargetObj } from "../../types";
import themeObjs from "../themes";
// import { useSize } from "ahooks";

interface CardOption extends CardStyleConfigObj {
    /**
     * 举些例子，[1, 2, 3]  [undefined, 2, undefined]  [1, undefined, undefined]
     */
    centerData: [number | undefined, number | undefined, number | undefined]  // 最多三个
}

interface IProps extends ClassAndStyle {
    option: CardOption
    theme: PannelTheme
}

const Card: React.FC<IProps> = (props) => {
    const { option, theme, className: cname = "", style = {} } = props;
    const themeObj = themeObjs[theme];

    // const resizeRef = useRef<HTMLDivElement>(null);
    // const size = useSize(resizeRef);

    const getFs = useCallback((type: "big" | "small") => {
        const { cardFontSize } = option;
        if (cardFontSize.open) {
            return type === "big" ? cardFontSize.mainSize : cardFontSize.viceSize;
        } else {
            return type === "big" ? cardFontSize.mainSize : cardFontSize.viceSize;
            // if (size) {
            //     return type === "big" ? size.width / 8.7 : size.width / 23;
            // } else {
            //     return 0;
            // }
        }
    }, [option]);

    const renderContent = useCallback(() => {
        return option.centerData.map((data, idx) => {
            const cardTarget: CardTargetObj = (option as any)[`cardTarget${idx + 1}`];
            return (<p key={idx}>
                <span style={{ color: cardTarget.priColor, fontSize: getFs("small") }}>{cardTarget.prefix}</span>
                <span style={{ color: cardTarget.centerColor, fontSize: idx === 1 ? getFs("big") : getFs("small") }}>{cardTarget.centerShow ? data : null}</span>
                <span style={{ color: cardTarget.sufColor, fontSize: getFs("small") }}>{cardTarget.suffix}</span>
            </p >);
        })
    }, [getFs, option]);

    return <div className={cn(cname, styles.container)} style={{
        background: themeObj.backgroundColor,
        ...style
    }
        // ref={resizeRef} 
    }>
        {renderContent()}
    </div >
};

export default Card;
