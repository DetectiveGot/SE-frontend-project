import { cn } from "@/lib/utils";
import React from "react";

const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, children, ...props}, ref) => {
    return (
        <div ref={ref} className={cn(className, "h-full p-2 sm:p-4 md:p-8 shadow w-full rounded-md border border-gray-400")} {...props}>
            <div className="p-4 h-full shadow rounded-md border border-gray-400 font-bold">
                {children}
            </div>
        </div>
    )
});

export default Container;