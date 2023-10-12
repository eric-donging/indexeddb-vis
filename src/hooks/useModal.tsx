import { useCallback, useState } from "react";

export default function useModal() {
    const [open, setOpen] = useState(false);
    const handleOk = useCallback((e: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
    }, []);
    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);
    const showModal = useCallback(() => {
        setOpen(true);
    }, []);

    return {
        open,
        showModal,
        handleOk,
        handleCancel,
    }
}
