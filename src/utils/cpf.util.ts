export function cleanCpf(value: string): string {
    return value.replace(/\D/g, "");
}

export function formatCpf(value: string): string {
    const digits = cleanCpf(value);
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export function isValidCpf(value: string): boolean {
    const digits = cleanCpf(value);

    if (!/^[0-9]{11}$/.test(digits)) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(digits)) {
        return false;
    }

    const numbers = digits.split("").map((char) => Number(char));

    const calculateCheckDigit = (sliceLength: number): number => {
        const weightStart = sliceLength + 1;
        const sum = numbers
            .slice(0, sliceLength)
            .reduce((acc, num, index) => acc + num * (weightStart - index), 0);
        const remainder = (sum * 10) % 11;
        return remainder === 10 ? 0 : remainder;
    };

    const firstCheck = calculateCheckDigit(9);
    const secondCheck = calculateCheckDigit(10);

    return firstCheck === numbers[9] && secondCheck === numbers[10];
}
