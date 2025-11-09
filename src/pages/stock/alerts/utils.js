export const statusColor = (s) => {
  switch (s) {
    case "critical":
      return "error";
    case "low":
      return "warning";
    case "sufficient":
      return "success";
    case "overstocked":
      return "default";
    default:
      return "default";
  }
};
