Во время разработки третьей версии [Демидовича](p:dodem) и второй версии [сайта-резюме](p:radkopeter) я решил использовать SQLite базу данных как промежуточный этап хранения информации, так как работать напрямую с файлами при генерации сложного сайта невероятно трудно.

Но с приходом баз данных возникла другая проблема — необходимость писать запросы для занесения и получения данных.
Делать это напрямую тоже очень неприятно, так как приходится писать очень много лишнего кода как прослойку между языком программирования и базой данных.

Библиотека SQLean как раз и выступает той самой прослойкой между кодом и базами данных.
С ней программисту больше не нужно писать сложные строковые запросы и заниматься преобразованиями типов.
Достаточно использовать удобные встроенные методы по вставке и выборке данных.

Библиотека также поддерживает работу с сущностями (entity), позволяя на уровне ООП установить прямое соответствие между классами в TypeScript и таблицами в базе данных. С этой технологией можно вообще избежать использования любых явных обращений к базе данных, работая непосредственно со своими классами, в то время как библиотека будет делать всю "грязную работу".