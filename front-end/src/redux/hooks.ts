import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/redux/store/store";

// Typed dispatch hook — use this instead of plain useDispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed selector hook — use this instead of plain useSelector
export const useAppSelector = useSelector.withTypes<RootState>();
