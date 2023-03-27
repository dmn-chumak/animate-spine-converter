export class ShapeUtil {
    public static extractVertices(instance:FlashElement):number[] {
        const vertices:number[] = [];

        if (instance.elementType !== 'shape') {
            return null;
        }

        for (const edge of instance.edges) {
            const halfEdge = edge.getHalfEdge(0);

            if (halfEdge != null) {
                const vertex = halfEdge.getVertex();
                vertices.push(vertex.x, -vertex.y);
            }
        }

        return vertices;
    }
}
