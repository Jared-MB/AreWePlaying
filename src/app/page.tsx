export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    //con searchParams podemos acceder a los parametros de la url pudiendo haber solo una cadena o un array de cadenas
    //o incluso no haber parametros

    const parametrosBusqueda = searchParams.a; //aqui accedemos al parametro a
    return (
        <div>
            <h1>My Page</h1>
            <p>
                Query Param A: {Array.isArray(parametrosBusqueda) ? parametrosBusqueda.join(", ") : parametrosBusqueda}
            </p>
        </div>
    );
}
