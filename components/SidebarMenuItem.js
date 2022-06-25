export default function SidebarMenuItem({ text, Icon, active }) {
  return (
    <div className="flex items-center justify-center space-x-3 text-lg text-gray-700 hoverEffect xl:justify-start">
      <Icon className="h-7" />
      <span className={`${active && "font-bold"} hidden xl:inline`}>{text}</span>
    </div>
  );
}