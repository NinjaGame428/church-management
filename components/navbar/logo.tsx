export const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-foreground"
      >
        <path
          d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
          fill="currentColor"
        />
        <path
          d="M12 18L13.09 20.26L16 21L13.09 21.74L12 24L10.91 21.74L8 21L10.91 20.26L12 18Z"
          fill="currentColor"
        />
      </svg>
    </div>
    <span className="text-xl font-bold">ChurchManager</span>
  </div>
);
