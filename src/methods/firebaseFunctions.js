import { FUNCTIONS } from "@/firebase/app";

export const getUrlData = FUNCTIONS.httpsCallable("getUrlData");
