const Error404 = () => null;

export const getServerSideProps = () => {
   return {
      redirect: {
         destination: '/',
         permanent: true,
      },
   };
};

export default Error404;
