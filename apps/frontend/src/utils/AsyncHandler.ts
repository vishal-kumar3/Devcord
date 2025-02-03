type AsyncHandler = (fn: () => void) => void;

const asyncHandler: AsyncHandler = async (fn) => {
    try {
        fn();
    } catch (error) {
        console.log(error)
    }
};

export default asyncHandler;