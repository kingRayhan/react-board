import ClassNames from "classnames";
import React from "react";

const Seats = () => {
  const [numberOfGuests, setNumberOfGuests] = React.useState<number>();

  return (
    <>
      <p>{numberOfGuests}</p>
      <div className="flex w-[500px] mx-auto gap-4 my-4 flex-wrap">
        {Array(50)
          .fill(0)
          .map((_, index) => (
            <div
              onClick={() => setNumberOfGuests(index + 1)}
              key={index}
              className={ClassNames(
                "flex items-center justify-center cursor-pointer w-10 h-10 bg-white border-solid rounded-full border-slate-200",
                {
                  "bg-red-300": numberOfGuests === index + 1,
                }
              )}
            >
              {index + 1}
            </div>
          ))}
      </div>
    </>
  );
};

export default Seats;
