
import { useMemo } from "react";
export function useCalculatedColumnsWithTopHeader({
  raawColumns,
}) {
  const { columns3 } =
    useMemo(() => {
        const columns3 = raawColumns.map((raawColumn, pos) => {
            //need to be changed
            let recursiveChild = (subChild, raawColumn) => {
              return (
                subChild.haveChildren === true &&
                subChild?.children.map((subChild2, index1) => {
                  const rawChild2 = {
                    ...subChild2,
                    topHeader: raawColumn.field,
                    children: recursiveChild(subChild2, raawColumn),
                    
                  };
                  return rawChild2;
                })
              );
            };
            const column = {
              ...raawColumn,
              topHeader: raawColumn.field,
              haveChildren:raawColumn.children ? true : false,
              children:
                raawColumn.haveChildren === true &&
                raawColumn?.children.map((child, index1) => {
                  
                  const rawChild = {
                    ...child,
                    topHeader: raawColumn.field,
                    children:
                      child.haveChildren === true &&
                      child?.children.map((subChild, index2) => {
                       
                        const rawChild1 = {
                          ...subChild,
                          topHeader: raawColumn.field,
                          children: recursiveChild(subChild, raawColumn),
                        };
                        return rawChild1;
                      }),
                  };
                  return rawChild;
                }),
            };  
            return column;
          });
      return {
        columns3,
       
      };
    }, [
      raawColumns, //need to be changed
    ]);
  return {
    columns3,
  };
}
