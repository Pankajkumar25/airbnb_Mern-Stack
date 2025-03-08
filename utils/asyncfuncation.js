// wrap async file me hum extra file add krte h jaise hum public folder ka use krte h 
// wrap Async try catch ka upgrade features h 
// function wrapAsync(fn) {
//         return function(req, res, next)
//         {
//             fn(req ,res , next).catch(next);

//         }
// }


module.exports = (fn) => {
        return (req, res, next) =>
        {
            fn(req ,res , next).catch(next);

        };
};

//module.exports = wrapAsync