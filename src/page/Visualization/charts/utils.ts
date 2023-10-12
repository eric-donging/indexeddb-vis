import { ceil } from "lodash";

/**
 * 将二维数组转置，且确保每个元素都是数字
 * @param matrix 
 * @returns 
 */
export function transpose(matrix: any[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[j][i] = emptyToZero(matrix[i][j]);
        }
    }
    return result;
}

function emptyToZero(n: null | undefined | number): number {
    if (Object.is(n, null) || Object.is(n, undefined) || Object.is(n, NaN)) {
        return 0;
    }
    return n as number;
}

export function getSum(arr: (number | undefined)[][]) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (typeof arr[i][j] === "number") {
                sum += arr[i][j]!;
            }
        }
    }
    return sum;
}

export function findMax(matrix: (number | undefined)[][]): number {
    let max = matrix[0][0];
    if (max) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (typeof matrix[i][j] === "number" && matrix[i][j]! > (max as number)) {
                    max = matrix[i][j];
                }
            }
        }
        return max as number;
    } else {
        return 0;
    }
}

export function getCeilNum(num: number): number {
    if (num < 10) {
        return num;
    }
    const tempNum = Math.ceil(num);
    const param = String(tempNum).length - 2;
    console.log(param, tempNum);
    return ceil(tempNum, -param);
}

export function bigNumberFormatter(value: any) {
    if (value >= 1000 && value < 10000) {
        value = value / 1000 + 'k';
    } else if (value >= 10000) {
        value = value / 10000 + 'M';
    }
    return value;
}
