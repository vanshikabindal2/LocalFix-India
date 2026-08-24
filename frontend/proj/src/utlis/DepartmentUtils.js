const departmentMap={
    "Pothole/Broken Road":"Road Department",
    "Street Light":"Electrical Department",
    "Water Leakage":"Water Department",
    "Garbage":"Sanitation Department",
    "Drainage/Sewer":"Drainage Department",
    "Traffic Signal":"Traffic Department",
    "Fallen Tree":"Municipal Department",
    "Stray Animal":"Animal Control Department",
    "Dangerous Building":"Building Department",
    "Waterlogging":"Drainage Department",
}


export const getDepartmentByCategory=(category)=>{
    return departmentMap[category]||"Municipal Department"
    
};
export default departmentMap;