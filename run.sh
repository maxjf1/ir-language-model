# ngram-count -text demo.xml -order 2 -addsmooth 0 -lm saida.xml
ngram-count -text demo.txt -lm saida.lm -write saida.xml -order 2 -addsmooth 0.01
ngram -order 2 -lm saida.lm -ppl demo.txt