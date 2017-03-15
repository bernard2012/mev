package edu.dfci.singlecell.tsne.domain;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import lombok.Setter;
import lombok.Getter;
import lombok.experimental.Accessors;
import edu.dfci.cccb.mev.dataset.domain.r.AbstractDispatchedRAnalysisBuilder;
import edu.dfci.cccb.mev.dataset.domain.r.annotation.Parameter;
import edu.dfci.cccb.mev.dataset.domain.r.annotation.R;
import edu.dfci.cccb.mev.dataset.domain.r.annotation.Result;


@R (synchronize = true, value = 
"function (dataset, perplexity=15, dims=2){\n" + 
"tx<-dataset\n" + 
"library(Rtsne)\n" + 
"tx<-as.matrix(tx)\n" +
"tx<-log(tx+1, 2)\n" +
"d<-dist(t(tx), method='euclidean')\n" +
"tsne_out<-Rtsne(d, is_distance=T, perplexity=perplexity, verbose=T, dims=dims)\n" +
"cc<-as.list(tsne_out$costs)\n" +
"names(cc) <- colnames(dataset)\n" +
"rownames(tsne_out$Y) <- colnames(dataset)\n" +
"colnames(tsne_out$Y) <- sapply(seq(1,dims),function(x)paste('PC',x,sep=''))\n" +
"list(theta=tsne_out$theta, perplexity=tsne_out$perplexity, " +
"costs=cc,y=apply (as.data.frame(t(tsne_out$Y)), 2, as.list))\n" +
"}")

@Accessors (fluent = true, chain = true)
public class TsneBuilder extends AbstractDispatchedRAnalysisBuilder<TsneBuilder, Tsne> {

 private @Parameter @Setter int perplexity;
 private @Parameter @Setter int dims;
 private @Result @Getter Tsne result;
 public TsneBuilder(){
	super("tsne");
 }
}

