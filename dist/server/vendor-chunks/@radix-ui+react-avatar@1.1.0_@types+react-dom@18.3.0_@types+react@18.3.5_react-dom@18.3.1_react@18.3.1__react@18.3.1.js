"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@radix-ui+react-avatar@1.1.0_@types+react-dom@18.3.0_@types+react@18.3.5_react-dom@18.3.1_react@18.3.1__react@18.3.1";
exports.ids = ["vendor-chunks/@radix-ui+react-avatar@1.1.0_@types+react-dom@18.3.0_@types+react@18.3.5_react-dom@18.3.1_react@18.3.1__react@18.3.1"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/@radix-ui+react-avatar@1.1.0_@types+react-dom@18.3.0_@types+react@18.3.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@radix-ui/react-avatar/dist/index.mjs":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@radix-ui+react-avatar@1.1.0_@types+react-dom@18.3.0_@types+react@18.3.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@radix-ui/react-avatar/dist/index.mjs ***!
  \****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Avatar: () => (/* binding */ Avatar),\n/* harmony export */   AvatarFallback: () => (/* binding */ AvatarFallback),\n/* harmony export */   AvatarImage: () => (/* binding */ AvatarImage),\n/* harmony export */   Fallback: () => (/* binding */ Fallback),\n/* harmony export */   Image: () => (/* binding */ Image),\n/* harmony export */   Root: () => (/* binding */ Root),\n/* harmony export */   createAvatarScope: () => (/* binding */ createAvatarScope)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/.pnpm/next@14.2.5_@playwright+test@1.47.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-context */ \"(ssr)/./node_modules/.pnpm/@radix-ui+react-context@1.1.0_@types+react@18.3.5_react@18.3.1/node_modules/@radix-ui/react-context/dist/index.mjs\");\n/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ \"(ssr)/./node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.0_@types+react@18.3.5_react@18.3.1/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs\");\n/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ \"(ssr)/./node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.0_@types+react@18.3.5_react@18.3.1/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs\");\n/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-primitive */ \"(ssr)/./node_modules/.pnpm/@radix-ui+react-primitive@2.0.0_@types+react-dom@18.3.0_@types+react@18.3.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@radix-ui/react-primitive/dist/index.mjs\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ \"(ssr)/./node_modules/.pnpm/next@14.2.5_@playwright+test@1.47.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-runtime.js\");\n/* __next_internal_client_entry_do_not_use__ Avatar,AvatarFallback,AvatarImage,Fallback,Image,Root,createAvatarScope auto */ // packages/react/avatar/src/Avatar.tsx\n\n\n\n\n\n\nvar AVATAR_NAME = \"Avatar\";\nvar [createAvatarContext, createAvatarScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__.createContextScope)(AVATAR_NAME);\nvar [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);\nvar Avatar = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef)=>{\n    const { __scopeAvatar, ...avatarProps } = props;\n    const [imageLoadingStatus, setImageLoadingStatus] = react__WEBPACK_IMPORTED_MODULE_0__.useState(\"idle\");\n    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(AvatarProvider, {\n        scope: __scopeAvatar,\n        imageLoadingStatus,\n        onImageLoadingStatusChange: setImageLoadingStatus,\n        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_3__.Primitive.span, {\n            ...avatarProps,\n            ref: forwardedRef\n        })\n    });\n});\nAvatar.displayName = AVATAR_NAME;\nvar IMAGE_NAME = \"AvatarImage\";\nvar AvatarImage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef)=>{\n    const { __scopeAvatar, src, onLoadingStatusChange = ()=>{}, ...imageProps } = props;\n    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);\n    const imageLoadingStatus = useImageLoadingStatus(src);\n    const handleLoadingStatusChange = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_4__.useCallbackRef)((status)=>{\n        onLoadingStatusChange(status);\n        context.onImageLoadingStatusChange(status);\n    });\n    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_5__.useLayoutEffect)(()=>{\n        if (imageLoadingStatus !== \"idle\") {\n            handleLoadingStatusChange(imageLoadingStatus);\n        }\n    }, [\n        imageLoadingStatus,\n        handleLoadingStatusChange\n    ]);\n    return imageLoadingStatus === \"loaded\" ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_3__.Primitive.img, {\n        ...imageProps,\n        ref: forwardedRef,\n        src\n    }) : null;\n});\nAvatarImage.displayName = IMAGE_NAME;\nvar FALLBACK_NAME = \"AvatarFallback\";\nvar AvatarFallback = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef)=>{\n    const { __scopeAvatar, delayMs, ...fallbackProps } = props;\n    const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);\n    const [canRender, setCanRender] = react__WEBPACK_IMPORTED_MODULE_0__.useState(delayMs === void 0);\n    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{\n        if (delayMs !== void 0) {\n            const timerId = window.setTimeout(()=>setCanRender(true), delayMs);\n            return ()=>window.clearTimeout(timerId);\n        }\n    }, [\n        delayMs\n    ]);\n    return canRender && context.imageLoadingStatus !== \"loaded\" ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_3__.Primitive.span, {\n        ...fallbackProps,\n        ref: forwardedRef\n    }) : null;\n});\nAvatarFallback.displayName = FALLBACK_NAME;\nfunction useImageLoadingStatus(src) {\n    const [loadingStatus, setLoadingStatus] = react__WEBPACK_IMPORTED_MODULE_0__.useState(\"idle\");\n    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_5__.useLayoutEffect)(()=>{\n        if (!src) {\n            setLoadingStatus(\"error\");\n            return;\n        }\n        let isMounted = true;\n        const image = new window.Image();\n        const updateStatus = (status)=>()=>{\n                if (!isMounted) return;\n                setLoadingStatus(status);\n            };\n        setLoadingStatus(\"loading\");\n        image.onload = updateStatus(\"loaded\");\n        image.onerror = updateStatus(\"error\");\n        image.src = src;\n        return ()=>{\n            isMounted = false;\n        };\n    }, [\n        src\n    ]);\n    return loadingStatus;\n}\nvar Root = Avatar;\nvar Image = AvatarImage;\nvar Fallback = AvatarFallback;\n //# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vQHJhZGl4LXVpK3JlYWN0LWF2YXRhckAxLjEuMF9AdHlwZXMrcmVhY3QtZG9tQDE4LjMuMF9AdHlwZXMrcmVhY3RAMTguMy41X3JlYWN0LWRvbUAxOC4zLjFfcmVhY3RAMTguMy4xX19yZWFjdEAxOC4zLjEvbm9kZV9tb2R1bGVzL0ByYWRpeC11aS9yZWFjdC1hdmF0YXIvZGlzdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBdUI7QUFDWTtBQUNKO0FBQ0M7QUFDTjtBQW9DbEI7QUE1QlIsSUFBTU0sY0FBYztBQUdwQixJQUFNLENBQUNDLHFCQUFxQkMsa0JBQWlCLEdBQUlQLDJFQUFrQkEsQ0FBQ0s7QUFTcEUsSUFBTSxDQUFDRyxnQkFBZ0JDLGlCQUFnQixHQUFJSCxvQkFBd0NEO0FBTW5GLElBQU1LLHVCQUFlWCw2Q0FBQSxDQUNuQixDQUFDYSxPQUFpQ0M7SUFDaEMsTUFBTSxFQUFFQyxhQUFBLEVBQWUsR0FBR0MsYUFBWSxHQUFJSDtJQUMxQyxNQUFNLENBQUNJLG9CQUFvQkMsc0JBQXFCLEdBQVVsQiwyQ0FBQSxDQUE2QjtJQUN2RixPQUNFLGdCQUFBSyxzREFBQUEsQ0FBQ0ksZ0JBQUE7UUFDQ1csT0FBT0w7UUFDUEU7UUFDQUksNEJBQTRCSDtRQUU1QkksVUFBQSxnQkFBQWpCLHNEQUFBQSxDQUFDRCxnRUFBU0EsQ0FBQ21CLElBQUEsRUFBVjtZQUFnQixHQUFHUCxXQUFBO1lBQWFRLEtBQUtWO1FBQUE7SUFBYztBQUcxRDtBQUdGSCxPQUFPYyxXQUFBLEdBQWNuQjtBQU1yQixJQUFNb0IsYUFBYTtBQVFuQixJQUFNQyw0QkFBb0IzQiw2Q0FBQSxDQUN4QixDQUFDYSxPQUFzQ0M7SUFDckMsTUFBTSxFQUFFQyxhQUFBLEVBQWVhLEdBQUEsRUFBS0Msd0JBQXdCLEtBQU8sR0FBRyxHQUFHQyxZQUFXLEdBQUlqQjtJQUNoRixNQUFNa0IsVUFBVXJCLGlCQUFpQmdCLFlBQVlYO0lBQzdDLE1BQU1FLHFCQUFxQmUsc0JBQXNCSjtJQUNqRCxNQUFNSyw0QkFBNEIvQixnRkFBY0EsQ0FBQyxDQUFDZ0M7UUFDaERMLHNCQUFzQks7UUFDdEJILFFBQVFWLDBCQUFBLENBQTJCYTtJQUNyQztJQUVBL0Isa0ZBQWVBLENBQUM7UUFDZCxJQUFJYyx1QkFBdUIsUUFBUTtZQUNqQ2dCLDBCQUEwQmhCO1FBQzVCO0lBQ0YsR0FBRztRQUFDQTtRQUFvQmdCO0tBQTBCO0lBRWxELE9BQU9oQix1QkFBdUIsV0FDNUIsZ0JBQUFaLHNEQUFBQSxDQUFDRCxnRUFBU0EsQ0FBQytCLEdBQUEsRUFBVjtRQUFlLEdBQUdMLFVBQUE7UUFBWU4sS0FBS1Y7UUFBY2M7SUFBQSxLQUNoRDtBQUNOO0FBR0ZELFlBQVlGLFdBQUEsR0FBY0M7QUFNMUIsSUFBTVUsZ0JBQWdCO0FBT3RCLElBQU1DLCtCQUF1QnJDLDZDQUFBLENBQzNCLENBQUNhLE9BQXlDQztJQUN4QyxNQUFNLEVBQUVDLGFBQUEsRUFBZXVCLE9BQUEsRUFBUyxHQUFHQyxlQUFjLEdBQUkxQjtJQUNyRCxNQUFNa0IsVUFBVXJCLGlCQUFpQjBCLGVBQWVyQjtJQUNoRCxNQUFNLENBQUN5QixXQUFXQyxhQUFZLEdBQVV6QywyQ0FBQSxDQUFTc0MsWUFBWTtJQUV2RHRDLDRDQUFBLENBQVU7UUFDZCxJQUFJc0MsWUFBWSxRQUFXO1lBQ3pCLE1BQU1LLFVBQVVDLE9BQU9DLFVBQUEsQ0FBVyxJQUFNSixhQUFhLE9BQU9IO1lBQzVELE9BQU8sSUFBTU0sT0FBT0UsWUFBQSxDQUFhSDtRQUNuQztJQUNGLEdBQUc7UUFBQ0w7S0FBUTtJQUVaLE9BQU9FLGFBQWFULFFBQVFkLGtCQUFBLEtBQXVCLFdBQ2pELGdCQUFBWixzREFBQUEsQ0FBQ0QsZ0VBQVNBLENBQUNtQixJQUFBLEVBQVY7UUFBZ0IsR0FBR2dCLGFBQUE7UUFBZWYsS0FBS1Y7SUFBQSxLQUN0QztBQUNOO0FBR0Z1QixlQUFlWixXQUFBLEdBQWNXO0FBSTdCLFNBQVNKLHNCQUFzQkosR0FBQTtJQUM3QixNQUFNLENBQUNtQixlQUFlQyxpQkFBZ0IsR0FBVWhELDJDQUFBLENBQTZCO0lBRTdFRyxrRkFBZUEsQ0FBQztRQUNkLElBQUksQ0FBQ3lCLEtBQUs7WUFDUm9CLGlCQUFpQjtZQUNqQjtRQUNGO1FBRUEsSUFBSUMsWUFBWTtRQUNoQixNQUFNQyxRQUFRLElBQUlOLE9BQU9PLEtBQUE7UUFFekIsTUFBTUMsZUFBZSxDQUFDbEIsU0FBK0I7Z0JBQ25ELElBQUksQ0FBQ2UsV0FBVztnQkFDaEJELGlCQUFpQmQ7WUFDbkI7UUFFQWMsaUJBQWlCO1FBQ2pCRSxNQUFNRyxNQUFBLEdBQVNELGFBQWE7UUFDNUJGLE1BQU1JLE9BQUEsR0FBVUYsYUFBYTtRQUM3QkYsTUFBTXRCLEdBQUEsR0FBTUE7UUFFWixPQUFPO1lBQ0xxQixZQUFZO1FBQ2Q7SUFDRixHQUFHO1FBQUNyQjtLQUFJO0lBRVIsT0FBT21CO0FBQ1Q7QUFDQSxJQUFNUSxPQUFPNUM7QUFDYixJQUFNd0MsUUFBUXhCO0FBQ2QsSUFBTTZCLFdBQVduQiIsInNvdXJjZXMiOlsid2VicGFjazovL2FyZV93ZV9wbGF5aW5nLy4uL3NyYy9BdmF0YXIudHN4PzIzMjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlQ29udGV4dFNjb3BlIH0gZnJvbSAnQHJhZGl4LXVpL3JlYWN0LWNvbnRleHQnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2tSZWYgfSBmcm9tICdAcmFkaXgtdWkvcmVhY3QtdXNlLWNhbGxiYWNrLXJlZic7XG5pbXBvcnQgeyB1c2VMYXlvdXRFZmZlY3QgfSBmcm9tICdAcmFkaXgtdWkvcmVhY3QtdXNlLWxheW91dC1lZmZlY3QnO1xuaW1wb3J0IHsgUHJpbWl0aXZlIH0gZnJvbSAnQHJhZGl4LXVpL3JlYWN0LXByaW1pdGl2ZSc7XG5cbmltcG9ydCB0eXBlIHsgU2NvcGUgfSBmcm9tICdAcmFkaXgtdWkvcmVhY3QtY29udGV4dCc7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEF2YXRhclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5jb25zdCBBVkFUQVJfTkFNRSA9ICdBdmF0YXInO1xuXG50eXBlIFNjb3BlZFByb3BzPFA+ID0gUCAmIHsgX19zY29wZUF2YXRhcj86IFNjb3BlIH07XG5jb25zdCBbY3JlYXRlQXZhdGFyQ29udGV4dCwgY3JlYXRlQXZhdGFyU2NvcGVdID0gY3JlYXRlQ29udGV4dFNjb3BlKEFWQVRBUl9OQU1FKTtcblxudHlwZSBJbWFnZUxvYWRpbmdTdGF0dXMgPSAnaWRsZScgfCAnbG9hZGluZycgfCAnbG9hZGVkJyB8ICdlcnJvcic7XG5cbnR5cGUgQXZhdGFyQ29udGV4dFZhbHVlID0ge1xuICBpbWFnZUxvYWRpbmdTdGF0dXM6IEltYWdlTG9hZGluZ1N0YXR1cztcbiAgb25JbWFnZUxvYWRpbmdTdGF0dXNDaGFuZ2Uoc3RhdHVzOiBJbWFnZUxvYWRpbmdTdGF0dXMpOiB2b2lkO1xufTtcblxuY29uc3QgW0F2YXRhclByb3ZpZGVyLCB1c2VBdmF0YXJDb250ZXh0XSA9IGNyZWF0ZUF2YXRhckNvbnRleHQ8QXZhdGFyQ29udGV4dFZhbHVlPihBVkFUQVJfTkFNRSk7XG5cbnR5cGUgQXZhdGFyRWxlbWVudCA9IFJlYWN0LkVsZW1lbnRSZWY8dHlwZW9mIFByaW1pdGl2ZS5zcGFuPjtcbnR5cGUgUHJpbWl0aXZlU3BhblByb3BzID0gUmVhY3QuQ29tcG9uZW50UHJvcHNXaXRob3V0UmVmPHR5cGVvZiBQcmltaXRpdmUuc3Bhbj47XG5pbnRlcmZhY2UgQXZhdGFyUHJvcHMgZXh0ZW5kcyBQcmltaXRpdmVTcGFuUHJvcHMge31cblxuY29uc3QgQXZhdGFyID0gUmVhY3QuZm9yd2FyZFJlZjxBdmF0YXJFbGVtZW50LCBBdmF0YXJQcm9wcz4oXG4gIChwcm9wczogU2NvcGVkUHJvcHM8QXZhdGFyUHJvcHM+LCBmb3J3YXJkZWRSZWYpID0+IHtcbiAgICBjb25zdCB7IF9fc2NvcGVBdmF0YXIsIC4uLmF2YXRhclByb3BzIH0gPSBwcm9wcztcbiAgICBjb25zdCBbaW1hZ2VMb2FkaW5nU3RhdHVzLCBzZXRJbWFnZUxvYWRpbmdTdGF0dXNdID0gUmVhY3QudXNlU3RhdGU8SW1hZ2VMb2FkaW5nU3RhdHVzPignaWRsZScpO1xuICAgIHJldHVybiAoXG4gICAgICA8QXZhdGFyUHJvdmlkZXJcbiAgICAgICAgc2NvcGU9e19fc2NvcGVBdmF0YXJ9XG4gICAgICAgIGltYWdlTG9hZGluZ1N0YXR1cz17aW1hZ2VMb2FkaW5nU3RhdHVzfVxuICAgICAgICBvbkltYWdlTG9hZGluZ1N0YXR1c0NoYW5nZT17c2V0SW1hZ2VMb2FkaW5nU3RhdHVzfVxuICAgICAgPlxuICAgICAgICA8UHJpbWl0aXZlLnNwYW4gey4uLmF2YXRhclByb3BzfSByZWY9e2ZvcndhcmRlZFJlZn0gLz5cbiAgICAgIDwvQXZhdGFyUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxuKTtcblxuQXZhdGFyLmRpc3BsYXlOYW1lID0gQVZBVEFSX05BTUU7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEF2YXRhckltYWdlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmNvbnN0IElNQUdFX05BTUUgPSAnQXZhdGFySW1hZ2UnO1xuXG50eXBlIEF2YXRhckltYWdlRWxlbWVudCA9IFJlYWN0LkVsZW1lbnRSZWY8dHlwZW9mIFByaW1pdGl2ZS5pbWc+O1xudHlwZSBQcmltaXRpdmVJbWFnZVByb3BzID0gUmVhY3QuQ29tcG9uZW50UHJvcHNXaXRob3V0UmVmPHR5cGVvZiBQcmltaXRpdmUuaW1nPjtcbmludGVyZmFjZSBBdmF0YXJJbWFnZVByb3BzIGV4dGVuZHMgUHJpbWl0aXZlSW1hZ2VQcm9wcyB7XG4gIG9uTG9hZGluZ1N0YXR1c0NoYW5nZT86IChzdGF0dXM6IEltYWdlTG9hZGluZ1N0YXR1cykgPT4gdm9pZDtcbn1cblxuY29uc3QgQXZhdGFySW1hZ2UgPSBSZWFjdC5mb3J3YXJkUmVmPEF2YXRhckltYWdlRWxlbWVudCwgQXZhdGFySW1hZ2VQcm9wcz4oXG4gIChwcm9wczogU2NvcGVkUHJvcHM8QXZhdGFySW1hZ2VQcm9wcz4sIGZvcndhcmRlZFJlZikgPT4ge1xuICAgIGNvbnN0IHsgX19zY29wZUF2YXRhciwgc3JjLCBvbkxvYWRpbmdTdGF0dXNDaGFuZ2UgPSAoKSA9PiB7fSwgLi4uaW1hZ2VQcm9wcyB9ID0gcHJvcHM7XG4gICAgY29uc3QgY29udGV4dCA9IHVzZUF2YXRhckNvbnRleHQoSU1BR0VfTkFNRSwgX19zY29wZUF2YXRhcik7XG4gICAgY29uc3QgaW1hZ2VMb2FkaW5nU3RhdHVzID0gdXNlSW1hZ2VMb2FkaW5nU3RhdHVzKHNyYyk7XG4gICAgY29uc3QgaGFuZGxlTG9hZGluZ1N0YXR1c0NoYW5nZSA9IHVzZUNhbGxiYWNrUmVmKChzdGF0dXM6IEltYWdlTG9hZGluZ1N0YXR1cykgPT4ge1xuICAgICAgb25Mb2FkaW5nU3RhdHVzQ2hhbmdlKHN0YXR1cyk7XG4gICAgICBjb250ZXh0Lm9uSW1hZ2VMb2FkaW5nU3RhdHVzQ2hhbmdlKHN0YXR1cyk7XG4gICAgfSk7XG5cbiAgICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgICAgaWYgKGltYWdlTG9hZGluZ1N0YXR1cyAhPT0gJ2lkbGUnKSB7XG4gICAgICAgIGhhbmRsZUxvYWRpbmdTdGF0dXNDaGFuZ2UoaW1hZ2VMb2FkaW5nU3RhdHVzKTtcbiAgICAgIH1cbiAgICB9LCBbaW1hZ2VMb2FkaW5nU3RhdHVzLCBoYW5kbGVMb2FkaW5nU3RhdHVzQ2hhbmdlXSk7XG5cbiAgICByZXR1cm4gaW1hZ2VMb2FkaW5nU3RhdHVzID09PSAnbG9hZGVkJyA/IChcbiAgICAgIDxQcmltaXRpdmUuaW1nIHsuLi5pbWFnZVByb3BzfSByZWY9e2ZvcndhcmRlZFJlZn0gc3JjPXtzcmN9IC8+XG4gICAgKSA6IG51bGw7XG4gIH1cbik7XG5cbkF2YXRhckltYWdlLmRpc3BsYXlOYW1lID0gSU1BR0VfTkFNRTtcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQXZhdGFyRmFsbGJhY2tcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuY29uc3QgRkFMTEJBQ0tfTkFNRSA9ICdBdmF0YXJGYWxsYmFjayc7XG5cbnR5cGUgQXZhdGFyRmFsbGJhY2tFbGVtZW50ID0gUmVhY3QuRWxlbWVudFJlZjx0eXBlb2YgUHJpbWl0aXZlLnNwYW4+O1xuaW50ZXJmYWNlIEF2YXRhckZhbGxiYWNrUHJvcHMgZXh0ZW5kcyBQcmltaXRpdmVTcGFuUHJvcHMge1xuICBkZWxheU1zPzogbnVtYmVyO1xufVxuXG5jb25zdCBBdmF0YXJGYWxsYmFjayA9IFJlYWN0LmZvcndhcmRSZWY8QXZhdGFyRmFsbGJhY2tFbGVtZW50LCBBdmF0YXJGYWxsYmFja1Byb3BzPihcbiAgKHByb3BzOiBTY29wZWRQcm9wczxBdmF0YXJGYWxsYmFja1Byb3BzPiwgZm9yd2FyZGVkUmVmKSA9PiB7XG4gICAgY29uc3QgeyBfX3Njb3BlQXZhdGFyLCBkZWxheU1zLCAuLi5mYWxsYmFja1Byb3BzIH0gPSBwcm9wcztcbiAgICBjb25zdCBjb250ZXh0ID0gdXNlQXZhdGFyQ29udGV4dChGQUxMQkFDS19OQU1FLCBfX3Njb3BlQXZhdGFyKTtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gUmVhY3QudXNlU3RhdGUoZGVsYXlNcyA9PT0gdW5kZWZpbmVkKTtcblxuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAoZGVsYXlNcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHRpbWVySWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiBzZXRDYW5SZW5kZXIodHJ1ZSksIGRlbGF5TXMpO1xuICAgICAgICByZXR1cm4gKCkgPT4gd2luZG93LmNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICAgIH1cbiAgICB9LCBbZGVsYXlNc10pO1xuXG4gICAgcmV0dXJuIGNhblJlbmRlciAmJiBjb250ZXh0LmltYWdlTG9hZGluZ1N0YXR1cyAhPT0gJ2xvYWRlZCcgPyAoXG4gICAgICA8UHJpbWl0aXZlLnNwYW4gey4uLmZhbGxiYWNrUHJvcHN9IHJlZj17Zm9yd2FyZGVkUmVmfSAvPlxuICAgICkgOiBudWxsO1xuICB9XG4pO1xuXG5BdmF0YXJGYWxsYmFjay5kaXNwbGF5TmFtZSA9IEZBTExCQUNLX05BTUU7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuZnVuY3Rpb24gdXNlSW1hZ2VMb2FkaW5nU3RhdHVzKHNyYz86IHN0cmluZykge1xuICBjb25zdCBbbG9hZGluZ1N0YXR1cywgc2V0TG9hZGluZ1N0YXR1c10gPSBSZWFjdC51c2VTdGF0ZTxJbWFnZUxvYWRpbmdTdGF0dXM+KCdpZGxlJyk7XG5cbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXNyYykge1xuICAgICAgc2V0TG9hZGluZ1N0YXR1cygnZXJyb3InKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcbiAgICBjb25zdCBpbWFnZSA9IG5ldyB3aW5kb3cuSW1hZ2UoKTtcblxuICAgIGNvbnN0IHVwZGF0ZVN0YXR1cyA9IChzdGF0dXM6IEltYWdlTG9hZGluZ1N0YXR1cykgPT4gKCkgPT4ge1xuICAgICAgaWYgKCFpc01vdW50ZWQpIHJldHVybjtcbiAgICAgIHNldExvYWRpbmdTdGF0dXMoc3RhdHVzKTtcbiAgICB9O1xuXG4gICAgc2V0TG9hZGluZ1N0YXR1cygnbG9hZGluZycpO1xuICAgIGltYWdlLm9ubG9hZCA9IHVwZGF0ZVN0YXR1cygnbG9hZGVkJyk7XG4gICAgaW1hZ2Uub25lcnJvciA9IHVwZGF0ZVN0YXR1cygnZXJyb3InKTtcbiAgICBpbWFnZS5zcmMgPSBzcmM7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaXNNb3VudGVkID0gZmFsc2U7XG4gICAgfTtcbiAgfSwgW3NyY10pO1xuXG4gIHJldHVybiBsb2FkaW5nU3RhdHVzO1xufVxuY29uc3QgUm9vdCA9IEF2YXRhcjtcbmNvbnN0IEltYWdlID0gQXZhdGFySW1hZ2U7XG5jb25zdCBGYWxsYmFjayA9IEF2YXRhckZhbGxiYWNrO1xuXG5leHBvcnQge1xuICBjcmVhdGVBdmF0YXJTY29wZSxcbiAgLy9cbiAgQXZhdGFyLFxuICBBdmF0YXJJbWFnZSxcbiAgQXZhdGFyRmFsbGJhY2ssXG4gIC8vXG4gIFJvb3QsXG4gIEltYWdlLFxuICBGYWxsYmFjayxcbn07XG5leHBvcnQgdHlwZSB7IEF2YXRhclByb3BzLCBBdmF0YXJJbWFnZVByb3BzLCBBdmF0YXJGYWxsYmFja1Byb3BzIH07XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0U2NvcGUiLCJ1c2VDYWxsYmFja1JlZiIsInVzZUxheW91dEVmZmVjdCIsIlByaW1pdGl2ZSIsImpzeCIsIkFWQVRBUl9OQU1FIiwiY3JlYXRlQXZhdGFyQ29udGV4dCIsImNyZWF0ZUF2YXRhclNjb3BlIiwiQXZhdGFyUHJvdmlkZXIiLCJ1c2VBdmF0YXJDb250ZXh0IiwiQXZhdGFyIiwiZm9yd2FyZFJlZiIsInByb3BzIiwiZm9yd2FyZGVkUmVmIiwiX19zY29wZUF2YXRhciIsImF2YXRhclByb3BzIiwiaW1hZ2VMb2FkaW5nU3RhdHVzIiwic2V0SW1hZ2VMb2FkaW5nU3RhdHVzIiwidXNlU3RhdGUiLCJzY29wZSIsIm9uSW1hZ2VMb2FkaW5nU3RhdHVzQ2hhbmdlIiwiY2hpbGRyZW4iLCJzcGFuIiwicmVmIiwiZGlzcGxheU5hbWUiLCJJTUFHRV9OQU1FIiwiQXZhdGFySW1hZ2UiLCJzcmMiLCJvbkxvYWRpbmdTdGF0dXNDaGFuZ2UiLCJpbWFnZVByb3BzIiwiY29udGV4dCIsInVzZUltYWdlTG9hZGluZ1N0YXR1cyIsImhhbmRsZUxvYWRpbmdTdGF0dXNDaGFuZ2UiLCJzdGF0dXMiLCJpbWciLCJGQUxMQkFDS19OQU1FIiwiQXZhdGFyRmFsbGJhY2siLCJkZWxheU1zIiwiZmFsbGJhY2tQcm9wcyIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZUVmZmVjdCIsInRpbWVySWQiLCJ3aW5kb3ciLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwibG9hZGluZ1N0YXR1cyIsInNldExvYWRpbmdTdGF0dXMiLCJpc01vdW50ZWQiLCJpbWFnZSIsIkltYWdlIiwidXBkYXRlU3RhdHVzIiwib25sb2FkIiwib25lcnJvciIsIlJvb3QiLCJGYWxsYmFjayJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/@radix-ui+react-avatar@1.1.0_@types+react-dom@18.3.0_@types+react@18.3.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@radix-ui/react-avatar/dist/index.mjs\n");

/***/ })

};
;