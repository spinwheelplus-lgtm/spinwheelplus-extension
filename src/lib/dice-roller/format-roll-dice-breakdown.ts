/** True when every landed face is a word. */
export const isWordOnlyFaceList = (
    values: readonly (number | null)[],
    labels?: readonly (string | null)[] | null,
): boolean => {
    let landed = 0;
    let words = 0;

    values.forEach((value, index) => {
        if (value == null) {
            return;
        }
        landed += 1;
        const label = labels?.[index];
        if (label != null && label !== "") {
            words += 1;
        }
    });

    return landed > 0 && words === landed;
};

/** Per-die line. A word replaces that face's number. */
export const formatRollDiceBreakdown = (
    values: readonly (number | null)[],
    labels?: readonly (string | null)[] | null,
): string =>
    values
        .map((value, index) => {
            if (value == null) {
                return "X";
            }
            const label = labels?.[index];
            return label != null && label !== "" ? label : String(value);
        })
        .join(" - ");
