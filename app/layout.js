export const metadata = {
  title: "Mock Test App",
  description: "Tablet-friendly test taking app with camera monitoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
