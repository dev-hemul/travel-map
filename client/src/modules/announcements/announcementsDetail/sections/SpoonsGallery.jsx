export const SpoonsGallery = ({ images, onImageClick }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Галерея робіт</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} onClick={() => onImageClick(img)} className="cursor-pointer">
            <img
              src={img}
              alt={`Ложка ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
