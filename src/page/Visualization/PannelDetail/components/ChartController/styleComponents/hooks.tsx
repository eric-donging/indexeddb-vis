import { useState, useCallback } from "react";

/**
 * 点击箭头收缩
 * @returns 
 */
export const useCollapse = ():[boolean,()=>void] => {
    const [isCollapse, setIsCollapse] = useState(false);

    const handleIconClick = useCallback(() => {
        setIsCollapse(prev => !prev)
    }, []);

    return [
        isCollapse,
        handleIconClick
    ];
};
