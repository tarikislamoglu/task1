import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangeBox({ selected, setSelected }) {
  const [open, setOpen] = useState(false);

  const startDate = selected.startDate
    ? new Date(selected.startDate)
    : new Date();
  const endDate = selected.endDate ? new Date(selected.endDate) : new Date();

  return (
    <div className="relative w-fit">
      <div
        onClick={() => setOpen(!open)}
        className="border px-3 py-2 rounded shadow cursor-pointer bg-white text-sm"
      >
        {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
      </div>

      {open && (
        <div className="absolute z-10 mt-2">
          <DateRange
            editableDateInputs
            onChange={(e) =>
              setSelected({
                startDate: e.selection.startDate,
                endDate: e.selection.endDate,
              })
            }
            moveRangeOnFirstSelection={false}
            ranges={[
              {
                startDate,
                endDate,
                key: "selection",
              },
            ]}
            rangeColors={["#3b82f6"]}
          />
        </div>
      )}
    </div>
  );
}
