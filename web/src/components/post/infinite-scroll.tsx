import { ReactNode, useEffect, useRef } from "react";

type InfiniteScrollProps = {
    children: ReactNode;
    loadMore: () => void;
};

function InfiniteScroll(props: InfiniteScrollProps) {
    const { children, loadMore } = props;

    const triggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const callback = (entries: IntersectionObserverEntry[]) => {
            const entry: IntersectionObserverEntry = entries[0];

            if (entry.isIntersecting && entry.target.id === "trigger") {
                loadMore();
            }
        };

        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 0,
        };

        const observer = new IntersectionObserver(callback, options);

        const trigger = triggerRef.current;
        if (trigger) observer.observe(trigger);

        return function () {
            if (trigger) observer.unobserve(trigger);
        };
    }, [loadMore]);

    return (
        <div>
            {children}
            <div ref={triggerRef} onClick={loadMore} id="trigger"></div>
        </div>
    );
}

export default InfiniteScroll;
