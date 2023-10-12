export default function delay(duration: number = 2000) {
    return new Promise((r) => {
        setTimeout(() => {
            r(1);
        }, duration)
    });
}