import API from "./api";


export const getDepartments = async () => {

    const res = await API.get("/departments");

    return res.data;

};