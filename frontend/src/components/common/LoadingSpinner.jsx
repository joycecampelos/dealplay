export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin">
      </div>
    </div>
  );
}
