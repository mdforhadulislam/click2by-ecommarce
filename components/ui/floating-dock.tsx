import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";
import { categories } from "../Nav/NavBar";
import { ArrowLeft, ChevronRight, X } from "lucide-react";


export const FloatingDock = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
  }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  const [isMenu, setIsMenu] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeCategory = categories.find(
    (cat) => cat.title === selectedCategory
  );

  return (
    <>
      {/* AnimatePresence for mounting/unmounting */}
      <AnimatePresence>
        {isMenu && (
          <motion.div
            key="menu-backdrop"
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Drawer */}
            <motion.div
              key="menu-drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl py-5 px-3 h-[68%]"
            >
              <div className="w-full p-3 h-full overflow-y-auto ">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                      >
                        <ArrowLeft className="h-5 w-5 " />
                      </button>
                    )}
                    <h2 className="text-lg font-semibold">
                      {selectedCategory || "Menu"}
                    </h2>
                  </div>
                  <button onClick={() => setIsMenu(false)}>
                    <X className="h-6 w-6 cursor-pointer" />
                  </button>
                </div>

                {/* Level 1 */}
                {!selectedCategory && (
                  <ul className="mt-4 space-y-4">
                    {categories.map((item, idx) => (
                      <li
                        key={idx}
                        className="border-b pb-2 text-neutral-700 hover:text-black cursor-pointer flex justify-between"
                        onClick={() => setSelectedCategory(item.title)}
                      >
                        {item.title}
                        {item.links.length > 0 && <ChevronRight />}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Level 2 */}
                {selectedCategory && activeCategory && (
                  <ul className="mt-4 space-y-4">
                    {activeCategory.links.map((sub, i) => (
                      <li
                        key={i}
                        className="border-b pb-2 text-neutral-600 hover:text-black cursor-pointer"
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Dock */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "mx-auto lg:hidden h-16 items-end gap-5 bg-gray-50 px-4 pb-3 flex justify-center",
          className
        )}
      >
        {items.map((item) => (
          <IconContainer
            mouseX={mouseX}
            key={item.title}
            {...item}
            setIsMenu={setIsMenu}
            isMenu={isMenu}
          />
        ))}
      </motion.div>
    </>
  );
};


function IconContainer({
  mouseX,
  title,
  icon,
  href,
  setIsMenu,
  isMenu
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
   setIsMenu: (value: boolean) => void;
   isMenu:boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 6;
  });

  const widthTransform = useTransform(distance, [-100, 0, 100], [40, 60, 40]);
  const heightTransform = useTransform(distance, [-100, 0, 100], [40, 60, 40]);

  const widthTransformIcon = useTransform(
    distance,
    [-100, 0, 100],
    [20, 40, 20]
  );
  const heightTransformIcon = useTransform(
    distance,
    [-100, 0, 100],
    [20, 40, 20]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 100,
    damping: 8,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 100,
    damping: 8,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 100,
    damping: 8,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 100,
    damping: 8,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a onClick={()=>{
      if(title== "MENU"){
        setIsMenu(!isMenu)
      }
    }}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 cursor-pointer"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700   "
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
