Przed uruchomieniem należy zainstalować ingress-nginx-controller.
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml
```
## Wersja produkcyjna

Aby uruchomić wersje produkcyjną należy:
Przejść do folderu frontend (cd frontend).

```
Zbudować obraz dockerowy frontendu ( docker build - t mkl1337/kubernetes-frontend:prod-1.0 .)
```

Przejść do folderu backend (cd backend).

```
Zbudować obraz dockerowy backendu ( docker build - t mkl1337/kubernetes-backend:prod-1.0 . )
```

Następnie w głównym folderze należy wywołać komendy:

```
kubectl create namespace production

kubectl apply -f ./production/backend/
kubectl apply -f ./production/frontend/
kubectl apply -f ./production/mongo/
kubectl apply -f ./production/redis/
kubectl apply -f ./production/ingress/
```

Aplikacja dostępna będzie pod:

http://localhost:80/production/

Aby usunąć wersje produkcyjna należy wykonać dwie komeny:
kubectl delete namespace production
kubectl delete persistentvolume mongo-pv-prod

## Wersja dla developmentu

Aby uruchomić wersje dla developmentu należy:
Przejść do folderu frontend (cd frontend).

```
Zbudować obraz dockerowy frontendu ( docker build - t mkl1337/kubernetes-frontend:dev-1.0 .)
```

Przejść do folderu backend (cd backend).

```
Zbudować obraz dockerowy backendu ( docker build - t mkl1337/kubernetes-backend:dev-1.0 . )
```

Następnie w głównym folderze należy wywołać komendy:

```
kubectl create namespace development

kubectl apply -f ./development/backend/
kubectl apply -f ./development/frontend/
kubectl apply -f ./development/mongo/
kubectl apply -f ./development/redis/
kubectl apply -f ./development/ingress/
```

Aplikacja dostępna będzie pod:

http://localhost:80/development/

Aby usunąć wersje development należy wykonać dwie komendy:
kubectl delete namespace development
kubectl delete persistentvolume mongo-pv-dev

## Kubernetes

Aplikacja działa jednocześnie i niezaleznie w namespace produkcyjnym i developmentu.
Frontend posiada tylko jedna replike, gdyż aplikacja nie wykonuje żadnych skomplikowanych czynności, które znacznie zwiększałyby obciążenie.
Backend posiada 2 repliki. W razie errorów jednej repliki, druga może kontynuować działanie.
Mongo i Redis posiadają 1 replikę.
Baza Mongo zapewnia trwałość danych dzięki PersistenVolumeClaim, który używa zasoby zarezerwowane przez PersistenVolume (storage: 20Mi).

## Funkcjonalość

Aplikacja ogranicza się do prostej funkcjonalnośći jaką jest dodawanie i usuwanie notatek.
Dodawać i usuwać dane można zarówno z mongo i redis. Dane są przechowywane oddzielnie, nie znikają po odświeżeniu strony.
