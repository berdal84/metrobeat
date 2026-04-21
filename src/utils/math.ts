export function clamp(value: number, min: number, max: number): number
{
    console.assert( min < max, "min should be strictly lower than max", min, max)
    if (value < min) return min;
    if (value > max) return max;
    return value;
}
