import { motion } from 'framer-motion';

const ModalOverlay = ({ onClick, variants, isLowPerf }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[9998]"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClick}
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        pointerEvents: 'auto',
        willChange: isLowPerf ? 'opacity' : 'opacity, backdrop-filter',
      }}
    />
  );
};

export default ModalOverlay;
