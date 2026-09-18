# Comandos de Git

## 1. git init
**Descripción:** Inicializa un nuevo repositorio Git.  
**Ejemplo:** `git init`  
**Caso de uso:** Se utiliza al comenzar el control de versiones de un proyecto.

## 2. git clone
**Descripción:** Crea una copia local de un repositorio remoto.  
**Ejemplo:** `git clone https://github.com/usuario/proyecto.git`  
**Caso de uso:** Sirve para descargar un proyecto desde GitHub.

## 3. git status
**Descripción:** Muestra el estado actual del repositorio.  
**Ejemplo:** `git status`  
**Caso de uso:** Permite identificar archivos modificados o pendientes de guardar.

## 4. git add
**Descripción:** Agrega archivos al área de preparación.  
**Ejemplo:** `git add .`  
**Caso de uso:** Prepara los cambios antes de realizar un commit.

## 5. git commit
**Descripción:** Guarda una versión de los cambios realizados.  
**Ejemplo:** `git commit -m "Agregar perfil"`  
**Caso de uso:** Registra cambios con un mensaje descriptivo.

## 6. git log
**Descripción:** Muestra el historial de commits.  
**Ejemplo:** `git log`  
**Caso de uso:** Permite consultar versiones anteriores del proyecto.

## 7. git branch
**Descripción:** Muestra las ramas existentes.  
**Ejemplo:** `git branch`  
**Caso de uso:** Sirve para identificar las ramas y la rama actual.

## 8. git checkout
**Descripción:** Permite cambiar entre ramas.  
**Ejemplo:** `git checkout main`  
**Caso de uso:** Se utiliza para cambiar de una rama a otra.

## 9. git switch
**Descripción:** Cambia de rama de forma directa.  
**Ejemplo:** `git switch main`  
**Caso de uso:** Es una alternativa moderna para cambiar entre ramas.

## 10. git merge
**Descripción:** Fusiona los cambios de una rama con otra.  
**Ejemplo:** `git merge ciencia-ficcion`  
**Caso de uso:** Permite integrar cambios dentro de la rama principal.

## 11. git push
**Descripción:** Envía commits locales a un repositorio remoto.  
**Ejemplo:** `git push origin main`  
**Caso de uso:** Se utiliza para subir cambios a GitHub.

## 12. git pull
**Descripción:** Descarga e integra cambios del repositorio remoto.  
**Ejemplo:** `git pull origin main`  
**Caso de uso:** Actualiza el repositorio local con cambios de GitHub.

## 13. git fetch
**Descripción:** Descarga información del repositorio remoto sin integrarla.  
**Ejemplo:** `git fetch origin`  
**Caso de uso:** Permite revisar cambios remotos antes de fusionarlos.

## 14. git remote
**Descripción:** Permite consultar repositorios remotos asociados.  
**Ejemplo:** `git remote -v`  
**Caso de uso:** Se utiliza para comprobar las direcciones remotas configuradas.

## 15. git diff
**Descripción:** Muestra las diferencias entre archivos modificados.  
**Ejemplo:** `git diff`  
**Caso de uso:** Sirve para revisar exactamente qué cambios se realizaron.

## 16. git restore
**Descripción:** Restaura un archivo a su estado anterior.  
**Ejemplo:** `git restore archivo.txt`  
**Caso de uso:** Permite descartar cambios no deseados.

## 17. git reset
**Descripción:** Permite retirar cambios del área de preparación.  
**Ejemplo:** `git reset archivo.txt`  
**Caso de uso:** Se utiliza si agregamos un archivo por error.

## 18. git rm
**Descripción:** Elimina un archivo del proyecto y del control de versiones.  
**Ejemplo:** `git rm archivo.txt`  
**Caso de uso:** Sirve para borrar archivos que ya no se necesitan.

## 19. git mv
**Descripción:** Permite mover o cambiar el nombre de un archivo.  
**Ejemplo:** `git mv viejo.txt nuevo.txt`  
**Caso de uso:** Se utiliza para renombrar archivos manteniendo su seguimiento.

## 20. git tag
**Descripción:** Crea etiquetas para identificar versiones importantes.  
**Ejemplo:** `git tag v1.0`  
**Caso de uso:** Sirve para marcar versiones específicas del proyecto.